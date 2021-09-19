import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from '../routes';


const Header = () => {
    return (
        <Menu style={{marginTop: '10px'}}>
            <Link route="/">
                <a className="item">GoFundMe</a>
            </Link>
            <Menu.Menu position="right">
                <Link route="/">
                    <a className="item">View Campaigns</a>
                </Link>
                <Link route="/campaigns/new">
                    <a className="item">New Campaign</a>
                </Link>
            </Menu.Menu>
        </Menu>
    )
};
export default Header;







// export default() => {
//     return (
//         <div className="ui menu">
//             <a className="item">Kickstart</a>
//             <div className="right menu">
//                 <a className="item">Create Campaign</a>
//                 <a className="item">Help</a>
//             </div>
//         </div>
//     )
// }