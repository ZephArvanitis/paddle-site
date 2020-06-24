using System;
using System.Collections.Generic;


namespace PaddleProject
{
    public interface IStringsProvider
    {
        IEnumerable<string> GetStrings();
    }
}
