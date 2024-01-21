
const Button = ({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (isOpen: boolean) => void}) => {

    return (
        <>
            {!isOpen ? (
                    <button id="arrowButton" className="hover:bg-indigo-400 p-2 rounded transform rotate-0 text-indigo-600" onClick={() => setIsOpen(!isOpen)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
            ) :
                (

                    <button id="arrowButton" className="hover:bg-indigo-400 p-2 rounded transform rotate-0 text-indigo-600" onClick={() => setIsOpen(!isOpen)}>
                        <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                )
            }

        </>
    )
}
export default Button;