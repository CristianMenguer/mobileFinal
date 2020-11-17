/**
 * This function works as a timer.
 * When called, will make the execution wait
 * for the time sent as param
 */
export const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
