for %%f in (*.js) DO c:jsmin <"%%f" >"Minified\%%f"
pause
