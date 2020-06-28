import { Todo } from "../Message Types/Todo";
import { TestMessage } from "../Message Types/TestMessage";

const doneWithStep2Button: HTMLButtonElement = document.querySelector("#DoneWithStep2");
const outputHeading: HTMLHeadingElement = document.querySelector("#Output");

class PaddleDimensions {
    widthCm: number;
    lengthCm: number;
    loomHeightCm: number;
    loomLengthCm: number;
    loomDepthCm: number;
    tipDepthCm: number;
    shoulderLengthCm: number;
}

class MakerInfo {
    email: string;
    name: string;
}

class PaddleMessage {
    paddleDimensionsMessage: PaddleDimensions;
    makerMessage: MakerInfo;
}

let CM_PER_INCH = 2.54;


class Program
{
    public static Main(): void
    {
        // How do jquery
        var button = $("#doneWithStep2Button")[0] as HTMLButtonElement;

        // Program.InitializeSynchronousXhr();
        // Program.InitializeAsynchronousXhr();
        // Program.InitializeFetch();
        Program.Initialize();
        // Program.InitializePostTest();
    }

    private static Initialize()
    {
        Program.InitializeScrollers();

        let calculateDimensionsButton: HTMLButtonElement = document.querySelector("#CalculateDimensionsButton");
        calculateDimensionsButton.onclick = Program.CalculatePaddleDimensions;

        let confirmDimensionsButton: HTMLButtonElement = document.querySelector("#ConfirmDimensionsButton");
        confirmDimensionsButton.onclick = Program.ConfirmDimensions;

        let doneWithPaddleButton: HTMLButtonElement = document.querySelector("#doneWithPaddleButton");
        doneWithPaddleButton.onclick = Program.PostPaddle;
    }

    private static InitializeScrollers()
    {
        let skip1aButton: HTMLButtonElement = document.querySelector("#skip1aButton");
        skip1aButton.onclick = () => { Program.ScrollToElement("step1b") };

        let doneWithStep2Button: HTMLButtonElement = document.querySelector("#doneWithStep2Button");
        doneWithStep2Button.onclick = () => { Program.ScrollToElement("step3") };

        let doneWithStep3Button: HTMLButtonElement = document.querySelector("#doneWithStep3Button");
        doneWithStep3Button.onclick = () => { Program.ScrollToElement("step4") };

        let doneWithStep4Button: HTMLButtonElement = document.querySelector("#doneWithStep4Button");
        doneWithStep4Button.onclick = () => { Program.ScrollToElement("step5") };
    }

    private static PostPaddle()
    {
        alert("Posting paddle");

        // The paddle is done! Post information about the maker and paddle dimensions to the database.
        var paddleDimensions = Program.GetPopulatedPaddleDimensions();
        var makerInfo = Program.GetPopulatedMakerInfo();

        var paddleMessage = new PaddleMessage();
        paddleMessage.paddleDimensionsMessage = paddleDimensions;
        paddleMessage.makerMessage = makerInfo;

        let url = window.location.href + "?handler=Paddle";

        // Handle verification token
        let requestVerificationTokenElement: HTMLInputElement = document.querySelector('input[name="__RequestVerificationToken"]'); // Requires call to @Html.RequestVerification();
        let requestVerificationToken = requestVerificationTokenElement.value;

        // Generate json
        let json = JSON.stringify(paddleMessage);

        fetch(url,
            {
                method: "POST",
                body: json,
                headers: {
                    "Content-Type": "application/json",
                    "RequestVerificationToken": requestVerificationToken,
                }            
            });
    }

    
    private static PostPaddleDimensions(paddleDimensions: PaddleDimensions)
    {
        alert("Posting paddle dimensions");

        let url = window.location.href + "?handler=PaddleDimensions";

        // Handle verification token
        let requestVerificationTokenElement: HTMLInputElement = document.querySelector('input[name="__RequestVerificationToken"]'); // Requires call to @Html.RequestVerification();
        let requestVerificationToken = requestVerificationTokenElement.value;

        // Generate json
        let json = JSON.stringify(paddleDimensions);

        fetch(url,
            {
                method: "POST",
                body: json,
                headers: {
                    "Content-Type": "application/json",
                    "RequestVerificationToken": requestVerificationToken,
                }            
            });
    }

    private static ConfirmDimensions()
    {
        alert("Confirming dimensions");

        // Get unit conversion as needed.
        var unitIsInches = (<HTMLInputElement>document.getElementById("unitinch")).checked;
        var conversionFactor = 1.0;
        if (unitIsInches)
        {
            conversionFactor = CM_PER_INCH;
        }

        let precision = 2;

        let paddleDimensions = Program.GetPopulatedPaddleDimensions();

        // Send paddle dimensions to the database!
        Program.PostPaddleDimensions(paddleDimensions);

        // Put dimensions at appropriate places elsewhere on the page.
        var dimensionMap: { [id: string]: number; } = {
            ".paddleLength": paddleDimensions.lengthCm,
            ".loomLength": paddleDimensions.loomLengthCm,
            ".loomDepth": paddleDimensions.loomDepthCm,
            ".tipDepth": paddleDimensions.tipDepthCm,
            ".tipWidth": paddleDimensions.widthCm,
            ".shoulderLength": paddleDimensions.shoulderLengthCm,
            ".loomHeight": paddleDimensions.loomHeightCm
        };

        for (let key in dimensionMap) {
            let value = dimensionMap[key];
            let elements = document.querySelectorAll(key);
            elements.forEach(element => {
                element.innerHTML = Program.RoundToDecimalPlace(value / conversionFactor, precision).toString();
            });
        }
        Program.ScrollToElement("step2");
    }

    private static ScrollToElement(elementId)
    {
        let element = document.getElementById(elementId);
        element.scrollIntoView();
    }

    private static CalculatePaddleDimensions() 
    {    
        alert("Calculating paddle dimensions");

        var unitIsInches = (<HTMLInputElement>document.getElementById("unitinch")).checked;
        var armSpan = parseFloat((<HTMLInputElement>document.getElementById("inputArmSpan")).value);
        var cubit = parseFloat((<HTMLInputElement>document.getElementById("inputCubit")).value);
        var shoulderWidth = parseFloat((<HTMLInputElement>document.getElementById("inputShoulderWidth")).value);
        var width = parseFloat((<HTMLInputElement>document.getElementById("inputWidth")).value);
        var kayakIsWide = (<HTMLInputElement>document.getElementById("wideKayak")).checked

        var conversionFactor = 1.0
        if (unitIsInches) {
            conversionFactor = CM_PER_INCH
        }

        var paddleDimensions = new PaddleDimensions();

        // Use inputs and convert to cm if needed.
        paddleDimensions.lengthCm = (armSpan + cubit) * conversionFactor;
        paddleDimensions.widthCm = width * conversionFactor;
        paddleDimensions.loomLengthCm = shoulderWidth * conversionFactor;

        // Add 5cm to the loom and total length if the kayak is wide.
        if (kayakIsWide) {
            paddleDimensions.loomLengthCm += 5;
            paddleDimensions.lengthCm += 5;
        }

        // Some dimensions are just constants.
        paddleDimensions.loomDepthCm = 3.8;
        paddleDimensions.tipDepthCm = 1.3;
        paddleDimensions.loomHeightCm = 2.9;
        paddleDimensions.shoulderLengthCm = 3.8;

        Program.PopulatePaddleDimensions(paddleDimensions, unitIsInches);
        Program.ScrollToElement("step1b");
    }

    private static RoundToDecimalPlace(num: number, numberDecimalPlaces: number)
    {
        let factor = 10 ** numberDecimalPlaces
        return Math.round(num * factor) / factor
    }

    private static GetPopulatedPaddleDimensions() 
    {
        var unitIsInches = (<HTMLInputElement>document.getElementById("unitinch")).checked;
        var conversionFactor = 1.0;
        if (unitIsInches)
        {
            conversionFactor = CM_PER_INCH;
        }

        var paddleDimensions = new PaddleDimensions();

        paddleDimensions.lengthCm = parseFloat((<HTMLInputElement>document.getElementById("inputPaddleLength")).value) * conversionFactor;
        paddleDimensions.widthCm = parseFloat((<HTMLInputElement>document.getElementById("inputTipWidth")).value) * conversionFactor;
        paddleDimensions.loomLengthCm = parseFloat((<HTMLInputElement>document.getElementById("inputLoomLength")).value) * conversionFactor;
        paddleDimensions.loomDepthCm = parseFloat((<HTMLInputElement>document.getElementById("inputLoomDepth")).value) * conversionFactor;
        paddleDimensions.loomHeightCm = parseFloat((<HTMLInputElement>document.getElementById("inputLoomHeight")).value) * conversionFactor;
        paddleDimensions.tipDepthCm = parseFloat((<HTMLInputElement>document.getElementById("inputTipDepth")).value) * conversionFactor;
        paddleDimensions.shoulderLengthCm = parseFloat((<HTMLInputElement>document.getElementById("inputShoulderLength")).value) * conversionFactor;

        return paddleDimensions;
    }

    private static GetPopulatedMakerInfo() 
    {
        var makerInfo = new MakerInfo();

        makerInfo.email = (<HTMLInputElement>document.getElementById("inputEmail")).value;
        makerInfo.name = (<HTMLInputElement>document.getElementById("inputName")).value;
        
        return makerInfo;
    }

    private static PopulatePaddleDimensions(paddleDimensions: PaddleDimensions, inInches: boolean)
    {
        var conversionFactor = 1.0;
        if (inInches)
        {
            conversionFactor = CM_PER_INCH;
        }

        let precision = 2;

        var lengthElement = <HTMLInputElement>document.getElementById("inputPaddleLength");
        lengthElement.value = Program.RoundToDecimalPlace(paddleDimensions.lengthCm / conversionFactor, precision).toString();

        var widthElement = <HTMLInputElement>document.getElementById("inputTipWidth");
        widthElement.value = Program.RoundToDecimalPlace(paddleDimensions.widthCm / conversionFactor, precision).toString();

        var loomHeightElement = <HTMLInputElement>document.getElementById("inputLoomHeight");
        loomHeightElement.value = Program.RoundToDecimalPlace(paddleDimensions.loomHeightCm / conversionFactor, precision).toString();

        var loomLengthElement = <HTMLInputElement>document.getElementById("inputLoomLength");
        loomLengthElement.value = Program.RoundToDecimalPlace(paddleDimensions.loomLengthCm / conversionFactor, precision).toString();

        var loomDepthElement = <HTMLInputElement>document.getElementById("inputLoomDepth");
        loomDepthElement.value = Program.RoundToDecimalPlace(paddleDimensions.loomDepthCm / conversionFactor, precision).toString();

        var tipDepthElement = <HTMLInputElement>document.getElementById("inputTipDepth");
        tipDepthElement.value = Program.RoundToDecimalPlace(paddleDimensions.tipDepthCm / conversionFactor, precision).toString();

        var shoulderLengthElement = <HTMLInputElement>document.getElementById("inputShoulderLength");
        shoulderLengthElement.value = Program.RoundToDecimalPlace(paddleDimensions.shoulderLengthCm / conversionFactor, precision).toString(); 
    }

    private static InitializePostTest()
    {
        doneWithStep2Button.addEventListener("click", () => {
            let url = window.location.href + "?handler=PaddleDimensions";

            let requestVerificationTokenElement: HTMLInputElement = document.querySelector('input[name="__RequestVerificationToken"]'); // Requires call to @Html.RequestVerification();

            let requestVerificationToken = requestVerificationTokenElement.value;

            var paddleDimensions = Program.GetPopulatedPaddleDimensions();

            // let paddleDimensionsMessage = new PaddleDimensionsMessage(paddleDimensions);

            let json = JSON.stringify(paddleDimensions);

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
        doneWithStep2Button.addEventListener("click", () => {
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
        doneWithStep2Button.addEventListener("click", () => {
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
        doneWithStep2Button.addEventListener("click", () => {
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