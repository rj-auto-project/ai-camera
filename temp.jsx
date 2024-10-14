model User {
  id             Int         @id @default(autoincrement())
  name           String
  password       String
  employee_Id    String      @unique
  createdAt      DateTime    @default(now())
  access_level   ACCESSLEVEL @default(VIEW)
  view_detection Boolean     @default(false)
}