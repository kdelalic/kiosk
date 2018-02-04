const devMode = false

let url

if(devMode) {
    url = ""
} else {
    url = "http://www.usekiosk.com"
}

export const baseURL = url