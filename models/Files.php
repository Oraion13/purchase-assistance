<?php

// Operations for 
// all the file storing tables
// is handeled here
class Files
{
    private $conn;

    public $table = '';

    public $id_name = '';
    public $col_name = '';
    public $col_type = '';
    public $col = '';

    public $id = 0;
    public $purchase_id = 0;
    public $col_name_value = '';
    public $col_type_value = '';
    public $col_value = '';

    // Connect to the DB
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Read all data
    public function read()
    {
        $query = 'SELECT * FROM ' . $this->table;

        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }

    // Read all data by purchase_id
    public function read_row()
    {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE purchase_id = :purchase_id';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->purchase_id = htmlspecialchars(strip_tags($this->purchase_id));

        $stmt->bindParam(':purchase_id' , $this->purchase_id);

        if ($stmt->execute()) {
            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }

    // Insert user data
    public function post()
    {
        $query = 'INSERT INTO ' . $this->table . ' SET purchase_id = :purchase_id, ' . $this->col_name . ' = :' . $this->col_name . ', '
        . $this->col_type . ' = :' . $this->col_type . ', '
        . $this->col . ' = :' . $this->col;

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->purchase_id = htmlspecialchars(strip_tags($this->purchase_id));
        
        $stmt->bindParam(':purchase_id', $this->purchase_id);
        $stmt->bindParam(':' . $this->col_name, $this->col_name_value);
        $stmt->bindParam(':' . $this->col_type, $this->col_type_value);
        $stmt->bindParam(':' . $this->col, $this->col_value);

        // If data inserted successfully, return True
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete data by id
    public function delete_row()
    {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE ' . $this->id_name . ' =: ' . $this->id_name;

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':' . $this->id_name , $this->id);

        if ($stmt->execute()) {
            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }
}
