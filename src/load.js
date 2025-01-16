const { TimeOutMilSeconds } = require("./configs");
const { onMessageUpsert} = require("./middlewares/onMU");

exports.load = (socket) => {
    socket.ev.on('messages.upsert', ({messages}) => {
        setTimeout(() => {
            onMessageUpsert({socket, messages});
        }, TimeOutMilSeconds);
    });
};