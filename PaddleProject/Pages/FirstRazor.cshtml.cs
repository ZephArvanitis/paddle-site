using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace PaddleProject.Pages
{
    public class FirstRazorModel : PageModel
    {
        public IEnumerable<string> Strings { get; set; }
        public IStringsProvider StringsProvider { get; }


        public FirstRazorModel(IStringsProvider stringsProvider)
        {
            this.StringsProvider = stringsProvider;
        }


        public void OnGet()
        {
            this.Strings = this.StringsProvider.GetStrings();
        }

        public IActionResult OnPostTest([FromBody] TestMessage testMessage)
        {
            Console.WriteLine(testMessage.Value);

            return new ObjectResult(3);
        }
    }
}
