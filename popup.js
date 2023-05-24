const btn = document.querySelector('.changecolorbtn');
const colorgrid=document.querySelector('.colorgrid');
const hexvalue=document.querySelector('.color-value-hex')
const rgbavalue=document.querySelector('.color-value-rgba')
btn.addEventListener('click', async () => {
    let [tabs] = await chrome.tabs.query({ active: true, currentWindow: true })
    chrome.scripting.executeScript({
        target: { tabId: tabs.id },
        function: pickcolor,
    }, async (result) => {
        // console.log(result); result was an array of objects
        const [data] = result; //Destructuring array  data is an object or result[0]

        function sRGBHexToRGBA(hex) {
            if (hex.charAt(0) === '#') {
                hex = hex.substr(1);
            }

            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            const a = 1.0;

            return `rgba(${r}, ${g}, ${b}, ${a})`;
        }
        if (data.result) {
            const colorhex=data.result.sRGBHex;
            const colorrgba=sRGBHexToRGBA(colorhex);
            // console.log(colorhex);
            // console.log(colorrgba);
            colorgrid.style.backgroundColor=colorhex;
            hexvalue.textContent=colorhex;
            rgbavalue.textContent=colorrgba;
            try{
                await navigator.clipboard.writeText(colorhex);  //copies the hexvalue of color to clipboard
            }catch(err){
                console.log(err);
            }
        }

    });
});

async function pickcolor() {

    try {
        const eyedropper = new EyeDropper();
        return await eyedropper.open();
    } catch (error) {
        console.log(error);
    }
}