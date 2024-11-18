package utez.edu.mx.inventario4c.utils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CustomResponseEntity {
    private Map<String, Object> body;

    // Response para status de OK
    public ResponseEntity<?> getOkResponse(String message, String status, int code, Object data) {
        body = new HashMap<>();
        body.put("message", message);
        body.put("status", status);
        body.put("code", code);
        if (data != null) {
            body.put("data", data);
        }

        return new ResponseEntity<>(body, HttpStatus.OK);
    }

    // Response para status de BAD REQUEST
    public ResponseEntity<?> get400Response() {
        body = new HashMap<>();
        body.put("message", "BAD_REQUEST");
        body.put("status", "error");
        body.put("code", 400);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // Response para status de NOT FOUND
    public ResponseEntity<?> get404Response() {
        body = new HashMap<>();
        body.put("message","Recurso no encontrado");
        body.put("status","NOT_FOUND");
        body.put("code",404);

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }
}
