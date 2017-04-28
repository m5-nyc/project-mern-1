import React, { Component } from'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { loginUser } from '../../actions';

const form = reduxForm({
    form: 'login',
});


class Login extends Component {
    handleFormSubmit(formProps) {
        this.props.loginUser(formProps);
    }

    renderAlert() {
        if (this.props.errorMessage) {
            return (
                <div>
                    <span><strong>ERROR!</strong> {this.props.errorMessage}</span>
                </div>
            );
        }
    }

    render() {
        const {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                {this.renderAlert()}
                <div className="row">
                    <div className="col-md-6">
                        <label>Email</label>
                        <Field name="email"
                               className="form-control"
                               component="input"
                               type="text" />
                    </div>
                    <div className="col-md-6">
                        <label>Password</label>
                        <Field name="password"
                               className="form-control"
                               component="input"
                               type="password" />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary">
                        Login
                    </button>
                </div>
            </form>
        );
    }
}

function mapStateToProps(state){
    return {
        errorMessage: state.auth.error,
        message: state.auth.message
    };
}

export default connect(mapStateToProps, { loginUser })(form(Login));