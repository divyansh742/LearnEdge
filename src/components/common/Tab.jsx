

const Tab = ({tabData,field,setField}) => {
  return (
    <div className="flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]">
        {tabData.map((element) => (
            <button key={element.id} onClick={() => setField(element.tabType)} 
            className={`${field === element.tabType ? "bg-richblack-900 text-richblack-5" : "bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}>
                {element?.tabName}
            </button>
        ))}
    </div>
  )
}

export default Tab
