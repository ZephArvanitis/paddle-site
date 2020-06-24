using System;
using System.Collections.Generic;


namespace PaddleProject
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
