"""Custom exceptions for the application"""


class AppException(Exception):
    """Base exception for the application"""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundException(AppException):
    """Raised when a resource is not found"""
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status_code=404)


class BadRequestException(AppException):
    """Raised when request is invalid"""
    def __init__(self, message: str = "Bad request"):
        super().__init__(message, status_code=400)


class UnauthorizedException(AppException):
    """Raised when user is not authenticated"""
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, status_code=401)


class ForbiddenException(AppException):
    """Raised when user does not have permission"""
    def __init__(self, message: str = "Forbidden"):
        super().__init__(message, status_code=403)
