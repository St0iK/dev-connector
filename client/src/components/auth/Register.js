import React, { Component } from 'react';

class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            errors: '',
        }
    }

    /**
     * On Change
     * @param {*} e 
     */
    onChange(e) {
        const elementName = e.target.name;
        const elementValue = e.target.value;
        console.log('test');
        this.setState({ [elementName]: elementValue })
    }

    render() {
        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">Create your DevConnector account</p>
                            <form action="create-profile.html">
                                <div className="form-group">
                                    <input type="text" className="form-control form-control-lg" placeholder="Name" name="name" required
                                        value={this.state.name}
                                        onChange={this.onChange.bind(this)}
                                    />
                                </div>
                                <div className="form-group">
                                    <input type="email" className="form-control form-control-lg" placeholder="Email Address" name="email"
                                        value={this.state.email}
                                        onChange={this.onChange.bind(this)}
                                    />
                                    <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control form-control-lg" placeholder="Password" name="password"
                                        value={this.state.password}
                                        onChange={this.onChange.bind(this)}
                                    />
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control form-control-lg" placeholder="Confirm Password" name="password2"
                                        value={this.state.password2}
                                        onChange={this.onChange.bind(this)}
                                    />
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

export default Register;
