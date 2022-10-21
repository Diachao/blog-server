window.onload = () => {

    const checkboxs = document.querySelectorAll('.eo-plugin-checkbox');

    for (let i = 0; i < checkboxs.length; i++) {
        checkboxs[i].addEventListener("change", (event) => {
            const attrType = event.target.getAttribute("data-event")
            const checkboxValue = event.target.checked;
            switch (attrType) {
                case "generateData": {
                    hanldeGenerateData(checkboxValue)
                    break;
                }
            }
        })
    }

    getInitStatus((statusObj) => {
        if (statusObj["generateData"] !== undefined) {
            document.querySelector(".eo-plugin-checkbox[data-event='generateData']").checked = statusObj["generateData"]
        }
    })

}

function hanldeGenerateData(checked) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { from: 'popup', event: "generateData", data: checked })
    });
}

function getInitStatus(cb) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { from: 'popup', event: "init" }, cb)
    });

}