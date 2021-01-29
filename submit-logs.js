//put this code in the browser somewhere
let logs = {
    info:[],
    log:[],
    warn:[],
    error:[]
}

const info = console.info.bind(console);
console.info = (...args) => {
    logs.info.push(args.map(JSON.stringify));
    info(...args);
}

const log = console.log.bind(console);
console.log = (...args) => {
    logs.log.push(args.map(JSON.stringify));
    log(...args);
}

const warn = console.warn.bind(console);
console.warn = (...args) => {
    logs.warn.push(args.map(JSON.stringify));
    warn(...args);
}

const errLog = console.error.bind(console);
console.error = (...args) => {
    logs.error.push(args.map(JSON.stringify));
    errLog(...args);
}

function submitLogs() {
    return fetch("/submit", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({log_tag:"LQ", log_content: JSON.stringify(logs)})
    });
}