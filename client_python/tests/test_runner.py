# Author: Dor Darmon

import unittest

#Discover and run all tests 
if __name__ == '__main__':
    loader = unittest.TestLoader()
    suite = loader.discover(start_dir='.', pattern='test_*.py')
    
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)