import { Todo } from "../Message Types/Todo";
import { TestMessage } from "../Message Types/TestMessage";

const theButton: HTMLButtonElement = document.querySelector("#TheButton");
const outputHeading: HTMLHeadingElement = document.querySelector("#Output");


class Program
{
    public static Main(): void
    {
        // Program.InitializeSynchronousXhr();
        // Program.InitializeAsynchronousXhr();
        // Program.InitializeFetch();
        Program.InitializePostTest();
    }

    private static InitializePostTest()
    {
        theButton.addEventListener("click", () => {
            let url = window.location.href + "?handler=Test";

            let requestVerificationTokenElement: HTMLInputElement = document.querySelector('input[name="__RequestVerificationToken"]'); // Requires call to @Html.RequestVerification();

            let requestVerificationToken = requestVerificationTokenElement.value;

            let testMessage = new TestMessage("AAA");

            let json = JSON.stringify(testMessage);

            fetch(url,
                {
                    method: "POST",
                    body: json,
                    headers: {
                        "Content-Type": "application/json",
                        "RequestVerificationToken": requestVerificationToken,
                    }            
                })
                .then(response => {
                    let json = response.json();
                    return json;
                })
                .then(json => {
                    let five = json + 3;

                    console.log(five);
                })
        });
    }

    private static InitializeFetch()
    {
        theButton.addEventListener("click", () => {
            let gettingTodos = Program.GettingTodos();

            gettingTodos.then(todos => {
                outputHeading.innerText = `Number of todos: ${todos.length}`;
            });
        });
    }

    private static GettingTodos() : Promise<Todo[]>
    {
        let url = "https://jsonplaceholder.typicode.com/todos/";

        let gettingTodos = fetch(url,
            {
                method: "GET",
            })
            .then(response => {
                let json = response.json();
                return json
            })
            .then(json => {
                let todos = json as Todo[];
                return todos;
            });

        return gettingTodos;
    }

    private static InitializeAsynchronousXhr()
    {
        Program.InitializeAsynchronousXhrInner(xhr => {
            let response = xhr.response;
            let todos = JSON.parse(response) as Todo[];

            outputHeading.innerText = `Number of todos: ${todos.length}`;
        })
    }

    private static InitializeAsynchronousXhrInner(callback: (xhr: XMLHttpRequest) => void)
    {
        theButton.addEventListener("click", () => {
            let url = "https://jsonplaceholder.typicode.com/todos/";
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.addEventListener("load", () => {
                callback(xhr);
            })
            xhr.open("GET", url);
            xhr.send();

            outputHeading.innerText = "Intermediate text";
        })
    }

    private static InitializeSynchronousXhr()
    {
        theButton.addEventListener("click", () => {
            let url = "https://jsonplaceholder.typicode.com/todos/";
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.open("GET", url, false); // Synchronous
            xhr.send();

            let response = xhr.response;
            let todos = JSON.parse(response) as Todo[];

            outputHeading.innerText = `Number of todos: ${todos.length}`;
        })
    }
}

Program.Main();