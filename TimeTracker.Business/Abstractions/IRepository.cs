﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.Business.Abstractions
{
    public interface IRepository<T> where T : BaseModel
    {
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAsync(string like, int take, int skip);
        Task<T> CreateAsync(T model);
        Task<T> UpdateAsync(T model);
        Task RemoveAsync(Guid id);
    }
}
