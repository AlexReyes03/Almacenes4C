package utez.edu.mx.inventario4c.auth.DTO;

public class AuthLoginDTO {
    private String password, user;

    // CONSTRUCTORES

    // Constructor vacío
    public AuthLoginDTO() {
    }

    // Constructor con parámetros
    public AuthLoginDTO(String password, String user) {
        this.password = password;
        this.user = user;
    }

    // GETERS Y SETTERS
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
