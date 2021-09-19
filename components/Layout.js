import React from "react";
import Header from './Header'
import Footer from './Footer'
import { Container } from 'semantic-ui-react'


// functional components take "props" argument
const Layout = (props) => {

    

    return (
        <Container
            style={{height: '100%'}}
        >
            <Header />
            {/* "STUFF" */}
            {props.children}

            <Footer />
        </Container>
    )
};
export default Layout;