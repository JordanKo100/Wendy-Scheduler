import { useState } from "react";

export default function Management(){
    const [panel, setPanel] = useState('appointments');

    return(
        <div className="managementPanel">
            <div className="sideBar">
                <ul>
                    <li>
                        <button onClick={() => {setPanel('appointments')}}>
                            Appointments
                        </button>
                    </li>
                    <li>                       
                        <button onClick={() => {setPanel('customers')}}>
                            Customers
                        </button>
                    </li>
                </ul>
            </div>

            {panel === 'appointments' && (
                <div>
                    Upcoming Appointments
                </div>
            )}
            {panel === 'customers' && (
                <div>
                    Top Customers
                </div>
            )}
        </div>
    )
}