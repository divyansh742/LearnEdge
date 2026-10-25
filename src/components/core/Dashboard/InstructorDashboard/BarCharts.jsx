import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const BarCharts = ({data,Icon,text,iconColor}) => { 
  return (
    <div className='w-full h-full bg-richblack-800 border-richblack-600 rounded-lg border p-3'>
      <div className='flex gap-2 items-center mb-2'>
        <Icon color={iconColor} size={25}/>
        <p className='text-richblack-300 font-semibold'>{text}</p>

      </div>
      {data.length === 0 && (<div className='text-center text-richblack-400'>No Data Available</div>)}
      {data.length > 0 && (<BarChart data={data} style={{ width: '100%', aspectRatio: 1.618 }}
      responsive>
        <XAxis dataKey="name" width="auto"  style={{fontSize: 10}}  />
        <YAxis width="auto" tickFormatter={(value) => text === 
          "Earnings Overview" ? `₹${value / 1000}k` : value}/>
        <Tooltip fill="#838894"/>
        <CartesianGrid/>
        <Bar dataKey="value" fill={iconColor} radius={[5,5,0,0]}/>
        
      </BarChart>)} 

      
    </div>
  )
}

export default BarCharts
