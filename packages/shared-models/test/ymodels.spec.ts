// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { IMapChange, YCodeCell, YNotebook } from '../src';

describe('@jupyterlab/shared-models', () => {
  describe('YNotebook', () => {
    describe('#constructor', () => {
      it('should create a notebook without arguments', () => {
        const notebook = YNotebook.create();
        expect(notebook.cells.length).toBe(1);
        expect(notebook.cells[0].cell_type).toBe('code');
      });

      it.each(['code', 'markdown', 'raw'])(
        'should create a %s initialized notebook',
        cellType => {
          const notebook = YNotebook.create({
            initialCellType: cellType as 'code' | 'markdown' | 'raw'
          });
          expect(notebook.cells.length).toBe(1);
          expect(notebook.cells[0].cell_type).toBe(cellType);
        }
      );
    });

    describe('metadata', () => {
      it('should get metadata', () => {
        const notebook = YNotebook.create();
        const metadata = {
          orig_nbformat: 1,
          kernelspec: {
            display_name: 'python',
            name: 'python'
          }
        };

        notebook.setMetadata(metadata);

        expect(notebook.metadata).toEqual(metadata);
      });

      it('should get all metadata', () => {
        const notebook = YNotebook.create();
        const metadata = {
          orig_nbformat: 1,
          kernelspec: {
            display_name: 'python',
            name: 'python'
          }
        };

        notebook.setMetadata(metadata);

        expect(notebook.getMetadata()).toEqual(metadata);
      });

      it('should get one metadata', () => {
        const notebook = YNotebook.create();
        const metadata = {
          orig_nbformat: 1,
          kernelspec: {
            display_name: 'python',
            name: 'python'
          }
        };

        notebook.setMetadata(metadata);

        expect(notebook.getMetadata('orig_nbformat')).toEqual(1);
      });

      it('should set one metadata', () => {
        const notebook = YNotebook.create();
        const metadata = {
          orig_nbformat: 1,
          kernelspec: {
            display_name: 'python',
            name: 'python'
          }
        };

        notebook.setMetadata(metadata);
        notebook.setMetadata('test', 'banana');

        expect(notebook.getMetadata('test')).toEqual('banana');
      });

      it('should update metadata', () => {
        const notebook = YNotebook.create();
        const metadata = notebook.getMetadata();
        expect(metadata).toBeTruthy();
        metadata.orig_nbformat = 1;
        metadata.kernelspec = {
          display_name: 'python',
          name: 'python'
        };
        notebook.setMetadata(metadata);
        {
          const metadata = notebook.getMetadata();
          expect(metadata.kernelspec!.name).toBe('python');
          expect(metadata.orig_nbformat).toBe(1);
        }
        notebook.updateMetadata({
          orig_nbformat: 2
        });
        {
          const metadata = notebook.getMetadata();
          expect(metadata.kernelspec!.name).toBe('python');
          expect(metadata.orig_nbformat).toBe(2);
        }
      });

      it('should emit all metadata changes', () => {
        const notebook = YNotebook.create();
        const metadata = {
          orig_nbformat: 1,
          kernelspec: {
            display_name: 'python',
            name: 'python'
          }
        };

        const changes: IMapChange[] = [];
        notebook.metadataChanged.connect((_, c) => {
          changes.push(c);
        });
        notebook.metadata = metadata;

        expect(changes).toHaveLength(2);
        expect(changes).toEqual([
          {
            type: 'add',
            key: 'orig_nbformat',
            newValue: metadata.orig_nbformat,
            oldValue: undefined
          },
          {
            type: 'add',
            key: 'kernelspec',
            newValue: metadata.kernelspec,
            oldValue: undefined
          }
        ]);

        notebook.dispose();
      });

      it('should emit a add metadata change', () => {
        const notebook = YNotebook.create();
        const metadata = {
          orig_nbformat: 1,
          kernelspec: {
            display_name: 'python',
            name: 'python'
          }
        };
        notebook.metadata = metadata;

        const changes: IMapChange[] = [];
        notebook.metadataChanged.connect((_, c) => {
          changes.push(c);
        });
        notebook.setMetadata('test', 'banana');

        expect(changes).toHaveLength(1);
        expect(changes).toEqual([
          { type: 'add', key: 'test', newValue: 'banana', oldValue: undefined }
        ]);

        notebook.dispose();
      });

      it('should emit a delete metadata change', () => {
        const notebook = YNotebook.create();
        const metadata = {
          orig_nbformat: 1,
          kernelspec: {
            display_name: 'python',
            name: 'python'
          }
        };
        notebook.metadata = metadata;

        const changes: IMapChange[] = [];
        notebook.setMetadata('test', 'banana');

        notebook.metadataChanged.connect((_, c) => {
          changes.push(c);
        });
        notebook.metadata = metadata;

        expect(changes).toHaveLength(1);
        expect(changes).toEqual([
          {
            type: 'delete',
            key: 'test',
            newValue: undefined,
            oldValue: 'banana'
          }
        ]);

        notebook.dispose();
      });

      it('should emit an update metadata change', () => {
        const notebook = YNotebook.create();
        const metadata = {
          orig_nbformat: 1,
          kernelspec: {
            display_name: 'python',
            name: 'python'
          }
        };
        notebook.metadata = metadata;

        const changes: IMapChange[] = [];
        notebook.setMetadata('test', 'banana');

        notebook.metadataChanged.connect((_, c) => {
          changes.push(c);
        });
        notebook.setMetadata('test', 'orange');

        expect(changes).toHaveLength(1);
        expect(changes).toEqual([
          {
            type: 'update',
            key: 'test',
            newValue: 'orange',
            oldValue: 'banana'
          }
        ]);

        notebook.dispose();
      });
    });

    describe('#insertCell', () => {
      it('should insert a cell', () => {
        const notebook = YNotebook.create();
        notebook.insertCell(0, { cell_type: 'code' });
        expect(notebook.cells.length).toBe(2);
      });
      it('should set cell source', () => {
        const notebook = YNotebook.create();
        const codeCell = notebook.insertCell(0, { cell_type: 'code' });
        codeCell.setSource('test');
        expect(notebook.cells[0].getSource()).toBe('test');
      });
      it('should update source', () => {
        const notebook = YNotebook.create();
        const codeCell = notebook.insertCell(0, { cell_type: 'code' });
        codeCell.setSource('test');
        codeCell.updateSource(0, 0, 'hello');
        expect(codeCell.getSource()).toBe('hellotest');
      });
    });
  });

  describe('YCell standalone', () => {
    it('should set source', () => {
      const codeCell = YCodeCell.createStandalone();
      codeCell.setSource('test');
      expect(codeCell.getSource()).toBe('test');
    });

    it('should update source', () => {
      const codeCell = YCodeCell.createStandalone();
      codeCell.setSource('test');
      codeCell.updateSource(0, 0, 'hello');
      expect(codeCell.getSource()).toBe('hellotest');
    });
  });
});
