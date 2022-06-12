import json
import os


shampoo_explain = [[] for i in range(6)]
shampoo_images = [[],[],[],[],[],[]]
disease_explain = ['``' for i in range(6)]
for i in range(1, 7):
    rootdir = f'src/shampoo/{i}'
    for file in os.listdir(rootdir):
        path = rootdir + '/' + file
        ext = file[file.rindex('.')+1:].lower()
        if ext == 'txt':
            lines = []
            with open(path, encoding='utf-8') as f:
                lines = f.readlines()

            content = f"`[{lines[0].strip()}]\n{''.join(lines[1:])}`"
            title = f"`{lines[0]}`"
            shampoo_explain[i-1].append({'title' : title, 'content' : content})
        else:
            shampoo_images[i-1].append(f"`{file}`")


for i in range(1, 7):
    rootdir = f'src/disease/{i}'
    if os.path.isfile(rootdir + '/설명1.txt'):
        with open(rootdir + '/설명1.txt', encoding='utf-8') as f:
            lines = f.readlines()
            content = ''.join(lines)
            disease_explain[i-1] = f'`{content}`'


if os.path.isfile('src/my/js/explain.js'):
    os.remove('src/my/js/explain.js')
with open('src/my/js/explain.js', 'w', encoding='utf-8') as f:
    content = f'export const SHAMPOO_EXPLAIN = {shampoo_explain}'
    content2 =  f'export const SHAMPOO_IMAGES  = {shampoo_images}'
    content3 = f'export const DISEASE_EXPLAIN = {disease_explain}'
    contents = [content, content2, content3]
    contents = list(map(lambda x : x.replace('\\n','<br>').replace("'",''), contents))
    print(contents)
    f.write('\n'.join(contents))

