﻿using System.Data;
using TimeTracker.Business.Models;
using TimeTracker.Business.Repositories;
using Dapper;
using TimeTracker.Business.Abstractions;

namespace TimeTracker.MsSql.Repositories
{
    public class TrackRepository : ITrackRepository
    {
        private readonly DapperContext dapperContext;

        public TrackRepository(DapperContext dapperContext)
        {
            this.dapperContext = dapperContext;
        }

        public async Task<TrackModel> GetByIdAsync(Guid id)
        {
            TrackModel track;
            using (IDbConnection db = dapperContext.CreateConnection())
            {
                track = await db.QueryFirstOrDefaultAsync<TrackModel>("SELECT * FROM Tracks WHERE Id = @Id", new { id });
            }

            return track;
        }

        public async Task<GetEntitiesResponse<TrackModel>> GetAsync(string like, int pageSize, int pageNumber, string kind)
        {
            IEnumerable<TrackModel> tracks;
            like = "%" + like + "%";
            string kindReg = "%" + kind + "%";

            int total;
            int skip = (pageNumber - 1) * pageSize;
            
            string query = "SELECT * FROM Tracks WHERE Title LIKE @like and Kind LIKE @trackKind ORDER BY StartTime DESC OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

            using (IDbConnection db = dapperContext.CreateConnection())
            {
                tracks = await db.QueryAsync<TrackModel>(query, new {like, skip, take = pageSize, trackKind = kindReg});
                total = await db.QueryFirstOrDefaultAsync<int>("SELECT COUNT(*) FROM Tracks WHERE Title LIKE @like and Kind LIKE @trackKind", new { like, trackKind = kindReg });
            }

            return new GetEntitiesResponse<TrackModel>
            {
                Entities = tracks,
                PageSize = pageSize,
                Total = total,
                TrackKind = kind
            };
        }

        public async Task<TrackModel> CreateAsync(TrackModel model)
        {
            model.CreatedAt = model.UpdatedAt = DateTime.Now;
            if (model.StartTime == null)
            {
                model.StartTime = DateTime.Now;
            }
            await StopAllAsync();
            using (IDbConnection db = dapperContext.CreateConnection())
            {
                string query = @"INSERT INTO Tracks 
                              (Id, Title, UserId, Kind, StartTime, CreatedAt, UpdatedAt)
                              VALUES (@Id, @Title, @UserId, @Kind, 
                              @StartTime, @CreatedAt, @UpdatedAt)";
                await db.QuerySingleOrDefaultAsync<Guid>(query, model);
            }

            return model;
        }

        public async Task<TrackModel> RemoveAsync(Guid id)
        {
            using (IDbConnection db = dapperContext.CreateConnection())
            {
                await db.QuerySingleOrDefaultAsync("DELETE FROM Tracks WHERE Id = @id", new { id });
                return new TrackModel();
            }
        }

        public async Task<TrackModel> UpdateAsync(TrackModel model)
        {
            model.UpdatedAt = DateTime.Now;
            string query = @"UPDATE Tracks 
                            SET Title = @Title, Kind = @Kind, StartTime = @StartTime, 
                            EndTime = @EndTime, UpdatedAt = @UpdatedAt WHERE Id = @Id";

            using (IDbConnection db = dapperContext.CreateConnection())
            {
                await db.QueryAsync<TrackModel>(query, model);
            }

            return model;
        }

        public async Task<IEnumerable<TrackModel>> GetAsync()
        {
            IEnumerable<TrackModel> tracks;
            using (IDbConnection db = dapperContext.CreateConnection())
            {
                tracks = await db.QueryAsync<TrackModel>("SELECT * FROM Tracks");
            }

            return tracks;
        }
        private async Task StopAllAsync()
        {
            IEnumerable<TrackModel> tracks;
            string query = "SELECT * FROM Tracks WHERE EndTime is null";

            using (IDbConnection db = dapperContext.CreateConnection())
            {
                tracks = await db.QueryAsync<TrackModel>(query);
            }
            foreach (var track in tracks)
            {
                track.EndTime = DateTime.Now;
                await UpdateAsync(track);
            }
        }

    }
}
