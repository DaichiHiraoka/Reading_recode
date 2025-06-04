use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Book {
    id: Uuid,
    title: String,
    notes: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct CreateBook {
    title: String,
}

#[derive(Debug, Deserialize)]
struct AddNote {
    note: String,
}

type Db = Arc<Mutex<HashMap<Uuid, Book>>>;

async fn list_books(db: web::Data<Db>) -> impl Responder {
    let books = db.lock().unwrap();
    let list: Vec<&Book> = books.values().collect();
    HttpResponse::Ok().json(list)
}

async fn create_book(db: web::Data<Db>, info: web::Json<CreateBook>) -> impl Responder {
    let mut books = db.lock().unwrap();
    let id = Uuid::new_v4();
    let book = Book {
        id,
        title: info.title.clone(),
        notes: Vec::new(),
    };
    books.insert(id, book.clone());
    HttpResponse::Ok().json(book)
}

async fn get_book(db: web::Data<Db>, path: web::Path<Uuid>) -> impl Responder {
    let books = db.lock().unwrap();
    if let Some(book) = books.get(&path.into_inner()) {
        HttpResponse::Ok().json(book)
    } else {
        HttpResponse::NotFound().finish()
    }
}

async fn add_note(
    db: web::Data<Db>,
    path: web::Path<Uuid>,
    note: web::Json<AddNote>,
) -> impl Responder {
    let mut books = db.lock().unwrap();
    if let Some(book) = books.get_mut(&path.into_inner()) {
        book.notes.push(note.note.clone());
        HttpResponse::Ok().json(book)
    } else {
        HttpResponse::NotFound().finish()
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db: Db = Arc::new(Mutex::new(HashMap::new()));
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db.clone()))
            .route("/books", web::get().to(list_books))
            .route("/books", web::post().to(create_book))
            .route("/books/{id}", web::get().to(get_book))
            .route("/books/{id}/notes", web::post().to(add_note))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
