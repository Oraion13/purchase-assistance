<?php

// Operations for 'purchase_purchases' is handeled here
class Purchases
{
    private $conn;
    private $table = 'purchase_purchases';

    public $purchase_id  = 0;
    public $purchase_type = '';
    public $purchase_from = '';
    public $purchase_to = '';
    public $department = '';
    public $purchase_name = '';
    public $purchase_purpose = '';
    public $is_consumable = 0;
    public $is_below = 0;

    public $start = 0;
    public $end = 0;

    // Connect to the DB
    public function __construct($db)
    {
        $this->conn = $db;
    }


    // Read all data
    public function read()
    {
        $query = 'SELECT * FROM ' . $this->table ;

        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }

    // Read all data by ID
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

    // Read all data by dates
    public function read_row_date()
    {
        $query = 'SELECT * FROM purchases WHERE purchase_from BETWEEN :start AND :end';

        $stmt = $this->conn->prepare($query);

        // // Clean the data
        $this->start = htmlspecialchars(strip_tags($this->start));
        $this->end = htmlspecialchars(strip_tags($this->end));

        $stmt->bindParam(':start', $this->start);
        $stmt->bindParam(':end', $this->end);

        if ($stmt->execute()) {
            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }


    // read a particular entry
    public function read_single()
    {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE purchase_type = :purchase_type'
            . ' AND purchase_from = :purchase_from AND purchase_to = :purchase_to AND department = :department AND purchase_name = :purchase_name'
            . ' AND purchase_purpose = :purchase_purpose AND is_consumable = :is_consumable AND is_below = :is_below';

        $stmt = $this->conn->prepare($query);

        // clean the data
        $this->purchase_type = htmlspecialchars(strip_tags($this->purchase_type));
        $this->purchase_from = htmlspecialchars(strip_tags($this->purchase_from));
        $this->purchase_to = htmlspecialchars(strip_tags($this->purchase_to));
        $this->department = htmlspecialchars(strip_tags($this->department));
        $this->purchase_name = htmlspecialchars(strip_tags($this->purchase_name));
        $this->purchase_purpose = htmlspecialchars(strip_tags($this->purchase_purpose));
        $this->is_consumable = htmlspecialchars(strip_tags($this->is_consumable));
        $this->is_below = htmlspecialchars(strip_tags($this->is_below));

        $stmt->bindParam(':purchase_type', $this->purchase_type);
        $stmt->bindParam(':purchase_from', $this->purchase_from);
        $stmt->bindParam(':purchase_to', $this->purchase_to);
        $stmt->bindParam(':department', $this->department);
        $stmt->bindParam(':purchase_name', $this->purchase_name);
        $stmt->bindParam(':purchase_purpose', $this->purchase_purpose);
        $stmt->bindParam(':is_consumable', $this->is_consumable);
        $stmt->bindParam(':is_below', $this->is_below);

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

    // Insert new purchase data
    public function post()
    {
        $query = 'INSERT INTO ' . $this->table . ' SET purchase_type = :purchase_type, purchase_year = :purchase_year, 
        department = :department, purchase_name = :purchase_name, purchase_purpose = :purchase_purpose, 
        is_consumable = :is_consumable, is_below = :is_below';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->purchase_type = htmlspecialchars(strip_tags($this->purchase_type));
        $this->purchase_year = htmlspecialchars(strip_tags($this->purchase_year));
        $this->department = htmlspecialchars(strip_tags($this->department));
        $this->purchase_name = htmlspecialchars(strip_tags($this->purchase_name));
        $this->purchase_purpose	= htmlspecialchars(strip_tags($this->purchase_purpose));
        $this->is_consumable = htmlspecialchars(strip_tags($this->is_consumable));
        $this->is_below = htmlspecialchars(strip_tags($this->is_below));

        $stmt->bindParam(':purchase_type', $this->purchase_type);
        $stmt->bindParam(':purchase_year', $this->purchase_year);
        $stmt->bindParam(':department', $this->department);
        $stmt->bindParam(':purchase_name', $this->purchase_name);
        $stmt->bindParam(':purchase_purpose', $this->purchase_purpose);
        $stmt->bindParam(':is_consumable', $this->is_consumable);
        $stmt->bindParam(':is_below', $this->is_below);

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
        $query = 'UPDATE ' . $this->table . ' SET ' . $to_set . ' WHERE purchase_id  = :purchase_id ';

        $stmt = $this->conn->prepare($query);

        $this->$to_update = htmlspecialchars(strip_tags($this->$to_update));
        $this->purchase_id  = htmlspecialchars(strip_tags($this->purchase_id ));

        $stmt->bindParam(':' . $to_update, $this->$to_update);
        $stmt->bindParam(':purchase_id', $this->purchase_id );

        // If data updated successfully, return True
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Delete a purchase
    public function delete_row()
    {
        $query = 'DELETE FROM ' . $this->table . ' WHERE purchase_id = :purchase_id';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->purchase_id = htmlspecialchars(strip_tags($this->purchase_id));

        $stmt->bindParam(':purchase_id', $this->purchase_id);

        if ($stmt->execute()) {
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }
}
