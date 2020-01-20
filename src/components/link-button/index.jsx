import React from 'react'
import './index.less'

/*
外形像链接的button
*/
export default function LinkButton(prop) {
  return <button className='link-button' {...prop}>{prop.children}</button>
}