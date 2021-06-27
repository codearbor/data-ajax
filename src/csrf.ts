export function csrfToken(): string | undefined {
  return $('meta[name=csrf-param]').attr('content');
}

export function csrfHeader(): string | undefined {
  return $('meta[name=csrf-header]').attr('content');
}

export function csrfAvailable(): boolean {
  return csrfHeader() !== undefined && csrfToken() !== undefined;
}
