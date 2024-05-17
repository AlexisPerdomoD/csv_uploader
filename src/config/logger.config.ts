import winston, {transports, format} from "winston"
const custom ={
    levels:{
        fatal:0,
        error:1, 
        warning:2,
        info:3,
        debug:4,
        http:5
    },
    colors:{
        fatal:"red",
        error:"red",
        warning:"yellow",
        info:"green",
        debug:"white",
        http:"blue"
    }
}
const logger = winston.createLogger({
    levels: custom.levels,
    transports:[
        new transports.Console({
            level:"http",
            format: format.combine(
                format.colorize({colors:custom.colors}),
                format.simple()
            )
        }),
        new transports.File({
        level:"warning",
        filename:".src/config/info/errors.log",
        format: format.simple()
    })
    ]
})



export default logger
 
