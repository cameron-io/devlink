import React from "react";

const Footer = () => {
  return (
    <footer style={{height: 'auto', width: '100%', backgroundColor: '#E5E5E5'}}>
        <div style={{margin: 'auto', maxWidth: '500px', textAlign: 'center', padding: '3rem 0rem'}}>
            <div style={{fontWeight: 'bold'}}>Connect to us: </div>
            <ul>
                <li><i className='fa-brands fa-facebook'></i> Facebook</li>
                <li><i className='fa-brands fa-x-twitter'></i> X/Twitter</li>
                <li><i className='fa-brands fa-instagram'></i> Instagram</li>
            </ul>
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
