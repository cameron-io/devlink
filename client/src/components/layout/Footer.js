import React from "react";

const Footer = () => {
  return (
    <footer style={{height: 'auto', width: '100%', backgroundColor: '#E5E5E5'}}>
        <div style={{margin: 'auto', maxWidth: '500px', textAlign: 'center', padding: '3rem 0rem'}}>
            <div style={{fontWeight: 'bold'}}>Connect to us: </div>
            <ul>
                <li><a href="#"><i class="fa-brands fa-facebook"></i></a> Facebook</li>
                <li><a href="#"><i class="fa-brands fa-x-twitter"></i></a> X/Twitter</li>
                <li><a href="#"><i class="fa-brands fa-instagram"></i></a> Instagram</li>
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
