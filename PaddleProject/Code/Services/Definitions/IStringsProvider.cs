using System;
using System.Collections.Generic;


namespace WebApplication5
{
    public interface IStringsProvider
    {
        IEnumerable<string> GetStrings();
    }
}
