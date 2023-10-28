using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

using System.Text.RegularExpressions;

using TimeTracker.Server.Extensions;
using TimeTracker.Server.GraphQL.Modules.FileManager;

namespace TimeTracker.Server.Services
{
    public class FileManagerService
    {
        public const string UsersAvatarsFolder = "Images/UsersAvatars";
        public const string SickLeavesFolder = "SickLeaves";
        public List<string> ProtectedFolders
        {
            get => new List<string>
            {
                UsersAvatarsFolder,
                SickLeavesFolder,
            };
        }

        private readonly Cloudinary cloudinary;
        private readonly IHttpContextAccessor httpContextAccessor;

        public FileManagerService(IHttpContextAccessor httpContextAccessor)
        {
            cloudinary = new Cloudinary(Environment.GetEnvironmentVariable("CLOUDINARY_URL"));
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<FileManagerItem>> GetInFolderAsync(string folderPath)
        {
            var searchFolders = string.IsNullOrEmpty(folderPath)
                ? await cloudinary.RootFoldersAsync()
                : await cloudinary.SubFoldersAsync(folderPath);
            var folders = searchFolders.Folders?.Select(f => new FileManagerItem
            {
                Name = f.Name,
                Path = f.Path,
                Kind = FileManagerItemKind.Folder,
                Permissions = GetPermissionsForFolder(httpContextAccessor.HttpContext.GetRole(), f.Path)
            });
            var searchFiles = await cloudinary.Search()
                .Expression($"folder:\"{folderPath}\"")
                .SortBy("public_id", "asc")
                .ExecuteAsync();
            var files = searchFiles.Resources?.Select(r => new FileManagerItem
            {
                Name = $"{r.FileName}.{r.Format}",
                Path = r.Url,
                CreatedAt = r.CreatedAt,
                Kind = FileManagerItemKind.File,
                Permissions = GetPermissionsForFile(httpContextAccessor.HttpContext.GetRole(), r.Url, r.FileName),
            });
            var result = new List<FileManagerItem>();
            if (folders != null)
                result.AddRange(folders);
            if (files != null)
                result.AddRange(files);
            return result;
        }

        public async Task CreateFolderAsync(string folderPath)
        {
            await cloudinary.CreateFolderAsync(folderPath);
        }

        public async Task<FileManagerItem> UploadFileAsync(string folderPath, IFormFile file, bool withHash = false)
        {
            string fileName = file.FileName;
            if (withHash)
                fileName = Guid.NewGuid() + "_" + fileName;
            string fileNameWithoutExtention = GetPublicIdFromFilaName(fileName);
            string publicId = String.IsNullOrEmpty(folderPath) ? fileNameWithoutExtention : $"{folderPath}/{fileNameWithoutExtention}";
            string filePath = String.IsNullOrEmpty(folderPath) ? fileName : $"{folderPath}/{fileName}";
            Stream stream = file.OpenReadStream();
            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(filePath, stream),
                PublicId = publicId,
                Overwrite = false,
            };
            var uploadResult = await cloudinary.UploadAsync(uploadParams);
            if (uploadResult.Error != null)
                throw new Exception(uploadResult.Error.Message);
            return new FileManagerItem
            {
                Name = $"{uploadResult.OriginalFilename}.{uploadResult.Format}",
                Path = uploadResult.Url.ToString(),
                Kind = FileManagerItemKind.File,
                CreatedAt = uploadResult.CreatedAt.ToString(),
                Permissions = GetPermissionsForFile(httpContextAccessor.HttpContext.GetRole(), uploadResult.Url.ToString(), uploadResult.OriginalFilename),
            };
        }

        public async Task<FileManagerItem> RenameFileAsync(string fromPath, string toName)
        {
            string fromFileName = GetFileNameFromPath(fromPath);
            if (GetPermissionsForFile(httpContextAccessor.HttpContext.GetRole(), fromPath, fromFileName) == FileManagerItemPermissions.Read)
                throw new Exception("You do not have access to this file");

            string toPublicId = GetPublicIdFromFilaName(toName);
            var result = await cloudinary.RenameAsync(GetPublicIdFromFilaName(fromFileName), toPublicId);
            if (result.Error != null)
                throw new Exception(result.Error.Message);
            string fileName = $"{result.PublicId}.{result.Format}";
            return new FileManagerItem
            {
                Name = fileName,
                Path = result.Url,
                Kind = FileManagerItemKind.File,
                CreatedAt = result.CreatedAt.ToString(),
                Permissions = GetPermissionsForFile(httpContextAccessor.HttpContext.GetRole(), result.Url, fileName),
            };
        }

        public async Task RemoveFileAsync(string path)
        {
            string resourceTypeString = GetResourseTypeFromPath(path);
            string fileName = GetFileNameFromPath(path);

            if (GetPermissionsForFile(httpContextAccessor.HttpContext.GetRole(), path, fileName) == FileManagerItemPermissions.Read)
                throw new Exception("You do not have access to this file");

            ResourceType resourceType;
            string publicId;
            switch (resourceTypeString)
            {
                case "image":
                    resourceType = ResourceType.Image;
                    publicId = Regex.Replace(fileName, @".\w+$", string.Empty);
                    break;
                case "video":
                    resourceType = ResourceType.Video;
                    publicId = fileName;
                    break;
                default:
                    resourceType = ResourceType.Raw;
                    publicId = fileName;
                    break;
            }
            var result = await cloudinary.DestroyAsync(new DeletionParams(publicId)
            {
                ResourceType = resourceType,
            });
            if (result.Error != null)
                throw new Exception(result.Error.Message);
        }

        public async Task RemoveFolderAsync(string folderPath)
        {
            if (GetPermissionsForFolder(httpContextAccessor.HttpContext.GetRole(), folderPath) == FileManagerItemPermissions.Read)
                throw new Exception("You do not have access to this folder");
            var result = await cloudinary.DeleteFolderAsync(folderPath);
            if (result.Error != null)
                throw new Exception(result.Error.Message);
        }

        private FileManagerItemPermissions GetPermissionsForFile(Business.Enums.Role role, string filePath, string fileName)
        {
            if (role == Business.Enums.Role.Admin)
                return FileManagerItemPermissions.ReadAndWrite;
            foreach (var protectedFolder in ProtectedFolders)
            {
                if (filePath.Contains(protectedFolder))
                    return FileManagerItemPermissions.Read;
            }
            return FileManagerItemPermissions.ReadAndWrite;
        }

        private FileManagerItemPermissions GetPermissionsForFolder(Business.Enums.Role role, string folderPath)
        {
            if (role == Business.Enums.Role.Admin)
                return FileManagerItemPermissions.ReadAndWrite;
            foreach (var protectedFolder in ProtectedFolders)
            {
                if (Regex.IsMatch(protectedFolder, $@"^{folderPath}"))
                    return FileManagerItemPermissions.Read;
            }
            return FileManagerItemPermissions.ReadAndWrite;
        }

        private string GetFileNameFromPath(string path)
        {
            var publicIdMatch = Regex.Match(path, @"\/(\w+)\/upload\/\w+\/(.+)");
            if (!publicIdMatch.Success)
                throw new Exception("Bad path");

            string resourceTypeString = publicIdMatch.Groups[1].Value;
            return publicIdMatch.Groups[2].Value;
        }

        private string GetPublicIdFromFilaName(string fileName)
        {
            return Regex.Replace(fileName, @".\w+$", string.Empty);
        }

        private string GetResourseTypeFromPath(string path)
        {
            var publicIdMatch = Regex.Match(path, @"\/(\w+)\/upload\/\w+\/(.+)");
            if (!publicIdMatch.Success)
                throw new Exception("Bad path");
            return publicIdMatch.Groups[1].Value;
        }
    }
}
