<?php

// Operations for 
// purchase_add_description
// is handeled here
class Add_description
{
    private $conn;

    private $table = 'purchase_add_description';

    public $col_name = '';

    public $id = 0;
    public $purchase_id = 0;
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

    // Read all data of a user by ID
    public function read_row()
    {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE purchase_id = :purchase_id';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->purchase_id = htmlspecialchars(strip_tags($this->purchase_id));

        $stmt->bindParam(':purchase_id', $this->purchase_id);

        if ($stmt->execute()) {
            // Fetch the data
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            // If data exists, return the data
            if ($row) {
                return $row;
            }
        }

        return false;
    }

    // Insert user data
    public function post()
    {
        $query = 'INSERT INTO ' . $this->table . ' SET purchase_id = :purchase_id, '
            . $this->col_name . ' = :' . $this->col_name;

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->purchase_id = htmlspecialchars(strip_tags($this->purchase_id));
        $this->col_value = htmlspecialchars(strip_tags($this->col_value));

        $stmt->bindParam(':purchase_id', $this->purchase_id);
        $stmt->bindParam(':' . $this->col_name, $this->col_value);

        // If data inserted successfully, return True
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Update a field
    public function update_row($to_update)
    {
        $to_set = $to_update . ' = :' . $to_update;
        $query = 'UPDATE ' . $this->table . ' SET ' . $to_set . ' WHERE add_description_id = :add_description_id';

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->col_value = htmlspecialchars(strip_tags($this->col_value));

        $stmt->bindParam(':' . $to_update, $this->col_value);
        $stmt->bindParam(':add_description_id', $this->id);

        // If data updated successfully, return True
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
