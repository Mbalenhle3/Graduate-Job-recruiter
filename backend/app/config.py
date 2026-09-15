from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str

    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 480

    app_environment: str = "development"

    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str
    smtp_password: str

    frontend_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()