// import './Alert.css'; // Import your CSS file for styling

import React from 'react'

export default function Alert(props) {
    return (
       props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show` }role="alert">
        {/* Props.alert &&  To make sure we have alert,
        setting alert type by JS6 */}

            <strong> {props.alert.msg}  </strong> 


        </div>
    )
}
