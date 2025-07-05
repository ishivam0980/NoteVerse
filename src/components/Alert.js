import React from 'react'

export default function Alert(props) {
    return (
        <div>
            {props.alert && (
                <div className="alert alert-primary" role={props.alert.type||"alert"}>
                    <div style={{ whiteSpace: 'pre-line' }}>
                        {props.alert.message}
                    </div>
                </div>
            )}
        </div>
    )
}
