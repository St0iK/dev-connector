import React, { Component } from 'react';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        }
    }

    /**
     * onChange
     * @param {Event} e 
     */
    onChange(e) {
        const elementName = e.target.name;
        const elementValue = e.target.value;
        console.log('test');
        this.setState({ [elementName]: elementValue })
    }

    /**
     * onSubmit
     * @param {Event} e 
     */
    onSubmit(e) {
        e.preventDefault();
        console.log({ state: this.state });
    }

    render() {
        return (
            <div className="login">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Log In</h1>
                            <p className="lead text-center">Sign in to your DevConnector account</p>
                            <form onSubmit={this.onSubmit.bind(this)}>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        placeholder="Email Address"
                                        name="email"
                                        onChange={this.onChange.bind(this)} />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        placeholder="Password"
                                        name="password"
                                        onChange={this.onChange.bind(this)} />
                                </div>
                                <input type="submit" className="btn btn-info btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
