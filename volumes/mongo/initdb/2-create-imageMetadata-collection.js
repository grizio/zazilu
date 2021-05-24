db.createCollection("imageMetadata")
db.imageMetadata.createIndex( { filename: "text" } )