import React, { useState, useEffect } from 'react';
import './auth.css';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { Alert, Avatar, Button, Dialog, DialogContent, DialogTitle, DialogActions, TextField, IconButton, Menu, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Auth = (props) => {
  const [user, setUser] = useState(null);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [logInOpen, setLogInOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [postUsername, setPostUsername] = useState('');
  const [userActionAnchorEl, setUserActionAnchorEl] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignUp = (e) => {
    e.preventDefault();
    const auth = getAuth();
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        // Obtener el usuario actual
        const user = auth.currentUser;
  
        // Actualizar manualmente el perfil con el displayName
        return updateProfile(user, {
          displayName: username
        });
      })
      .then(() => {
        // Esperar a que se complete la actualización del perfil
        return new Promise((resolve) => {
          setTimeout(resolve, 2000); // Esperar 2 segundos (ajusta según sea necesario)
        });
      })
      .then(() => {
        // Obtener el usuario actualizado
        const user = auth.currentUser;
        // Debería mostrar el displayName actualizado
        //console.log(user.displayName);
        // Pasar el nombre de usuario al componente Post
        setPostUsername(user.displayName);
  
        // Restablecer los campos del formulario
        setUsername('');
        setEmail('');
        setPassword('');
        setError('');
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  
  

  const handleLogIn = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        const user = auth.currentUser;

        setLogInOpen(false);
        setUserActionAnchorEl(null);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth);
    setPostUsername('');
  };



  return (
    <>
      <div>
        {user ? (
          <div className='header-avatar'>
            <Avatar
              onClick={(e) => setUserActionAnchorEl(e.currentTarget)}
              alt={user.displayName}
              src=''
            />
            <p className="header-avatar-txt">{user.displayName}</p>
            <Menu
              id='user-actions'
              anchorEl={userActionAnchorEl}
              open={!!userActionAnchorEl}
              onClose={(e) => setUserActionAnchorEl(null)}
            >
              <MenuItem onClick={handleSignOut}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <div>
            <Button onClick={() => setSignUpOpen(true)}>SignUp</Button>
            <Button onClick={() => setLogInOpen(true)}>LogIn</Button>
          </div>
        )}
        
        <Dialog
          onClose={() => {
            setSignUpOpen(false);
            setError('');
          }}
          aria-labelledby='SignUp'
          open={signUpOpen}
        >
          <DialogTitle id='sign-up-dialog-title' className='auth-dialog-title'>
            <img className='auth-logo' src='src/assets/instagram-logo-17.png' alt='' />
          </DialogTitle>
          <form onSubmit={handleSignUp}>
            <DialogContent>
              <div className='auth-dialog-content'>
                <div className='auth-dialog-input'>
                  <TextField
                    id='username'
                    label='Username'
                    variant='outlined'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className='auth-dialog-input'>
                  <TextField
                    id='email'
                    label='Email'
                    variant='outlined'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='auth-dialog-input'>
                  <TextField
                    id='password'
                    label='Password'
                    variant='outlined'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <div className='auth-dialog-error'>
                    <Alert
                      severity='error'
                      action={
                        <IconButton
                          aria-label='close'
                          color='inherit'
                          size='small'
                          onClick={() => setError('')}
                        >
                          <CloseIcon fontSize='inherit' />
                        </IconButton>
                      }
                    >
                      {error}
                    </Alert>
                  </div>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button type='submit' autoFocus>
                SignUp
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog
          onClose={() => {
            setLogInOpen(false);
            setError('');
          }}
          aria-labelledby='LogIn'
          open={logInOpen}
        >
          <DialogTitle id='log-in-dialog-title' className='auth-dialog-title'>
            <img alt='' className='auth-logo' src='src/assets/instagram-logo-17.png' />
          </DialogTitle>
          <form onSubmit={handleLogIn}>
            <DialogContent>
              <div className='auth-dialog-content'>
                <div className='auth-dialog-input'>
                  <TextField
                    id='email'
                    label='Email'
                    variant='outlined'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='auth-dialog-input'>
                  <TextField
                    id='password'
                    label='Password'
                    variant='outlined'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <div className='auth-dialog-error'>
                    <Alert
                      severity='error'
                      action={
                        <IconButton
                          aria-label='close'
                          color='inherit'
                          size='small'
                          onClick={() => setError('')}
                        >
                          <CloseIcon fontSize='inherit' />
                        </IconButton>
                      }
                    >
                      {error}
                    </Alert>
                  </div>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button type='submit' autoFocus>
                LogIn
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </>
  );
};

export default Auth;
