package utez.edu.mx.inventario4c.modules.user.DTO;

import utez.edu.mx.inventario4c.modules.rol.Rol;

// DATA TRANSFER OBJECT (DTO): PLANTILLA DE TRANSFERENCIA PARA RECUPERAR USUARIOS
public class UserDTO {
    private long id;
    private String name, surname, lastname, email, username;
    private Rol rol;

    public UserDTO() { }

    public UserDTO(long id, String name, String surname, String lastname, String email, String username, Rol rol) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.email = email;
        this.username = username;
        this.rol = rol;
    }

    // --------- GETTERS AND SETTERS

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}
