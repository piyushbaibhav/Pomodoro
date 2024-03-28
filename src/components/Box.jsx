import React from 'react'
import Items from './Items'

export default function Box(props) {
    const items = props.data.map(
        (SingleData, key) => {
            return <Items removeHandler={props.removeHandler} key={key} id={key} item={SingleData.item} time={SingleData.time}/>
        }
    )
    return (
    <div className='bg-black text-white p-3'>
        {items}
        { /*<Items/>
        <Items/>
        <Items/>
        <Items/>
    <Items/> */}
    </div>
    )
}
