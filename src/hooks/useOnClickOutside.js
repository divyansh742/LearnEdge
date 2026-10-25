import { useEffect } from 'react'
//this custom hook detect click outside of ref componenet and call the handler function 
const useOnClickOutside = (ref,handlerFunction) => {
    useEffect(() => {
      const listener = (event) => {
        //touch inside or on the ref component do nothing
        if(!ref.current || ref.current.contains(event.target)){
            return;
        }
        handlerFunction(event);
      }

      //add event listener for click and touch on ref
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
    
      //cleanup function to remove the event listener when the component unmounts 
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchdown", listener);
      }
    }, [ref, handlerFunction])//only run when ref or handler func changed
}

export default useOnClickOutside
