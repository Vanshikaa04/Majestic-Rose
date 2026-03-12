export const fadeIn=(direction, delay) =>{
    return{
        hidden:{
            y: direction==="up"?30 : direction === "down"? -10 : 0,
            x: direction==="left"?40 : direction === "right"? -80 : 0,
            opacity:0.7
        },
        show:{
            y:0,
            x:0,
            opacity: 1,
            transition: {
                type: "tween",
                duration: 0.5,
                delay : delay,
                ease: [0.25,0.25,0.25,0.75]
            }
        }
    }
}
