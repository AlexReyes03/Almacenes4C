package utez.edu.mx.inventario4c.utils.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import utez.edu.mx.inventario4c.modules.user.User;
import utez.edu.mx.inventario4c.modules.user.UserRepository;

import java.util.Collections;

@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService{

    // INYECCIÓN DE DEPENDENCIAS

    @Autowired
    private UserRepository userRepository;

    // Carga los detalles de un usuario por su nombre de usuario
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Buscar el usuario por nombre de usuario
        User user = userRepository.findByUsername(username);
        if(user == null) {
            throw new UsernameNotFoundException("Usuario no encontrado: " + username);
        }

        // Obtiene el rol del usuario y lo asigna como autoridad
        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRol().getName());

        // Devuelve un objeto UserDetails con los detalles del usuario y su rol
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                Collections.singleton(authority));
    }
}
