import React from "react";

const Footer = () => {
  return (
    <footer style={{height: 'auto', width: '100%', backgroundColor: '#E5E5E5'}}>
        <div style={{margin: 'auto', maxWidth: '300px', textAlign: 'center', padding: '2rem 0rem'}}>
            <p style={{fontWeight: 'bold'}}>Connect to us</p>
            <p className='fa-brands fa-facebook' style={{padding: '0rem 0.5rem 0rem 0.5rem'}}/>
            <p className='fa-brands fa-x-twitter' style={{padding: '0rem 0.5rem 0rem 1rem'}}/>
            <p className='fa-brands fa-instagram' style={{padding: '0rem 0.5rem 0rem 1rem'}}/>
        </div>
        <div style={{textAlign: 'center', padding: '1rem 0rem', backgroundColor: '#343a40'}}>
            <p style={{color: 'white'}}>
                Copyright &copy; 2024 by Linkdev. All rights reserved.
            </p>
        </div>
    </footer>
  );
};

export default Footer;
