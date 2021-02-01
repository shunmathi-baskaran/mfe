import React, { Suspense, lazy, useState, useEffect } from 'react';
import Header from './components/Header'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import Progress from './components/Progress'
import { createBrowserHistory } from 'history';


const generateClassName = createGenerateClassName({
    productionPrefix: 'co'
});

const history = createBrowserHistory();

const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/AuthApp'));
const DashboardLazy = lazy(() => import('./components/DashboardApp'))

//App component
export default () => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        if(isSignedIn){
            history.push('/dashboard');
        }
    }, [isSignedIn]);


    return (
            <Router history={history}>
                <StylesProvider generateClassName={generateClassName}>
                    <div>
                        <Header 
                        isSignedIn={isSignedIn}
                        onSignOut={() => setIsSignedIn(false)}/>
                        <Suspense fallback={<Progress />}>
                            <Switch>
                                <Route path="/auth">
                                    <AuthLazy onSignIn={() => setIsSignedIn(true)} />
                                </Route>
                                <Route path="/dashboard">
                                    {!isSignedIn && <Redirect to="/" />}
                                    <DashboardLazy />
                                </Route>
                                <Route path="/" component={MarketingLazy}/> 
                            </Switch>
                        </Suspense>
                    </div>
                </StylesProvider>
            </Router>
    )
}