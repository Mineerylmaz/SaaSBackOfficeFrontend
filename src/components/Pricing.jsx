import React from 'react';
import '../styles/Pricing.css';

const Pricing = () => {
    return (
        <section className="pricing-section">
            <div className="container">
                <div className="pricing-header">
                    <h2>Pricing & Plans</h2>
                    <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
                </div>

                <div className="pricing-table">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>
                                    <span>Free</span>
                                    <p className="price">$0</p>
                                    <p>Per month</p>
                                </th>
                                <th>
                                    <span>Team</span>
                                    <p className="price">$99</p>
                                    <p>Per month</p>
                                </th>
                                <th className="popular">
                                    <span>Popular</span>
                                    <p className="price">$150</p>
                                    <p>Per month</p>
                                </th>
                                <th>
                                    <span>Enterprise</span>
                                    <p className="price">$490</p>
                                    <p>Per month</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Website number</td>
                                <td>01</td>
                                <td>10</td>
                                <td className="popular">50</td>
                                <td>Unlimited</td>
                            </tr>
                            <tr>
                                <td>Server storage</td>
                                <td>100 GB</td>
                                <td>500 GB</td>
                                <td className="popular">1 TB</td>
                                <td>Unlimited</td>
                            </tr>
                            <tr>
                                <td>Database</td>
                                <td>-</td>
                                <td>15</td>
                                <td className="popular">Unlimited</td>
                                <td>Unlimited</td>
                            </tr>
                            <tr>
                                <td>Unmetered Bandwidth</td>
                                <td>-</td>
                                <td>✓</td>
                                <td className="popular">✓</td>
                                <td>✓</td>
                            </tr>
                            <tr>
                                <td>SSD Disk</td>
                                <td>-</td>
                                <td>-</td>
                                <td className="popular">✓</td>
                                <td>✓</td>
                            </tr>
                            <tr>
                                <td>WordPress Install</td>
                                <td>-</td>
                                <td>-</td>
                                <td className="popular">✓</td>
                                <td>✓</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><button>Get Started</button></td>
                                <td><button>Get Started</button></td>
                                <td className="popular"><button>Get Started</button></td>
                                <td><button>Get Started</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
