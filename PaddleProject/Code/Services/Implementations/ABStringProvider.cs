using System;
using System.Collections.Generic;


namespace WebApplication5
{
    public class ABStringProvider : IStringsProvider
    {
        public IEnumerable<string> GetStrings()
        {
            yield return "Aa";
            yield return "Bb";
        }
    }
}
